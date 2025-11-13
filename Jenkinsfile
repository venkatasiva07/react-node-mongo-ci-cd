pipeline {
    agent any

    environment {
        DOCKERHUB_USER = "venkatasivareddybhavanam834"
        BACKEND_IMAGE = "${DOCKERHUB_USER}/simple-backend"
        FRONTEND_IMAGE = "${DOCKERHUB_USER}/simple-frontend"
        EC2_IP = "54.90.201.141"
    }

    triggers {
        githubPush()
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Backend Image') {
            steps {
                sh "docker build -t ${BACKEND_IMAGE}:latest ./backend"
            }
        }

        stage('Build Frontend Image') {
            steps {
                sh "docker build -t ${FRONTEND_IMAGE}:latest ./frontend"
            }
        }

        stage('Login Docker Hub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DH_USER',
                    passwordVariable: 'DH_PASS'
                )]) {
                    sh "echo $DH_PASS | docker login -u $DH_USER --password-stdin"
                }
            }
        }

        stage('Push Images') {
            steps {
                sh "docker push ${BACKEND_IMAGE}:latest"
                sh "docker push ${FRONTEND_IMAGE}:latest"
            }
        }

        stage('Deploy to EC2') {
            steps {
                withCredentials([sshUserPrivateKey(
                    credentialsId: 'ec2-ssh-key',
                    keyFileVariable: 'SSH_KEY',
                    usernameVariable: 'SSH_USER'
                )]) {

                    sh """
chmod 600 $SSH_KEY

ssh -o StrictHostKeyChecking=no -i $SSH_KEY $SSH_USER@$EC2_IP << EOF

echo "Pulling latest images..."
docker pull ${BACKEND_IMAGE}:latest
docker pull ${FRONTEND_IMAGE}:latest

echo "Stopping existing containers..."
docker rm -f backend frontend mongo || true

echo "Creating Docker network..."
docker network create app-network || true

echo "Starting MongoDB..."
docker run -d --name mongo --network app-network mongo

echo "Starting Backend..."
docker run -d --name backend --network app-network \
  -p 5000:5000 \
  -e MONGO_URI=mongodb://mongo:27017/mydb \
  ${BACKEND_IMAGE}:latest

echo "Starting Frontend..."
docker run -d --name frontend --network app-network \
  -p 80:80 \
  ${FRONTEND_IMAGE}:latest

echo "Deployment complete."
EOF
"""
                }
            }
        }
    }
}
