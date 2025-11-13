import React, { useEffect, useState } from "react";

function App() {
  const [items, setItems] = useState([]);
  const [text, setText] = useState("");

  const fetchItems = async () => {
    const res = await fetch("/api/items");
    const data = await res.json();
    setItems(data);
  };

  const addItem = async () => {
    await fetch("/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: text })
    });
    setText("");
    fetchItems();
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Fullstack CI/CD App</h1>

      <input
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Add item"
      />
      <button onClick={addItem}>Add</button>

      <ul>
        {items.map((i) => (
          <li key={i._id}>{i.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
