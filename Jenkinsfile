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

    stage('Build Backend') {
      steps {
        sh "docker build -t $BACKEND_IMAGE backend/"
      }
    }

    stage('Build Frontend') {
      steps {
        sh "docker build -t $FRONTEND_IMAGE frontend/"
      }
    }

    stage('Login Docker Hub') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub-creds',
          usernameVariable: 'USER', passwordVariable: 'PASS')]) {
            sh "echo $PASS | docker login -u $USER --password-stdin"
        }
      }
    }

    stage('Push Images') {
      steps {
        sh "docker push $BACKEND_IMAGE"
        sh "dpipeline {
  agent any

  environment {
    DOCKERHUB_USER = "venkatasivareddybhavanam834"
    BACKEND_IMAGE = "${DOCKERHUB_USER}/simple-backend"
    FRONTEND_IMAGE = "${DOCKERHUB_USER}/simple-frontend"
    EC2_IP = "54.90.201.141"
  }

  triggers {
    githubPush()   // 🚀 triggers on git push
  }

  stages {

    stage('Checkout Code') {
      steps {
        checkout scm
      }
    }

    stage('Build Backend Image') {
      steps {
        sh "docker build -t $BACKEND_IMAGE:latest backend/"
      }
    }

    stage('Build Frontend Image') {
      steps {
        sh "docker build -t $FRONTEND_IMAGE:latest frontend/"
      }
    }

    stage('Login to Docker Hub') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
          sh "echo $PASS | docker login -u $USER --password-stdin"
        }
      }
    }

    stage('Push Images') {
      steps {
        sh "docker push $BACKEND_IMAGE:latest"
        sh "docker push $FRONTEND_IMAGE:latest"
      }
    }

    stage('Deploy to EC2') {
      steps {
        withCredentials([sshUserPrivateKey(credentialsId: 'ec2-ssh-key', keyFileVariable: 'SSH_KEY', usernameVariable: 'SSH_USER')]) {
          sh '''
            chmod 600 $SSH_KEY

            ssh -o StrictHostKeyChecking=no -i $SSH_KEY $SSH_USER@${EC2_IP} << 'EOF'

              docker pull ${BACKEND_IMAGE}:latest
              docker pull ${FRONTEND_IMAGE}:latest

              docker rm -f frontend backend mongo || true

              docker network create app-network || true

              docker run -d --name mongo --network app-network mongo:6

              docker run -d --name backend --network app-network \
                -p 5000:5000 \
                -e MONGO_URI=mongodb://mongo:27017/simpledb \
                ${BACKEND_IMAGE}:latest

              docker run -d --name frontend --network app-network \
                -p 80:80 \
                ${FRONTEND_IMAGE}:latest

            EOF
          '''
        }
      }
    }
  }
}
cker push $FRONTEND_IMAGE"
      }
    }

    stage('Deploy EC2') {
      steps {
        withCredentials([sshUserPrivateKey(credentialsId mpcredentialsId: 'ec2-ssh-key',
          keyFileVariable: 'SSH_KEY', usernameVariable: 'SSH_USER')]) {

          sh '''
          ssh -o StrictHostKeyChecking=no -i $SSH_KEY $SSH_USER@$EC2_IP << 'EOF'

            cd ~/app/

            docker-compose -f docker-compose.prod.yml pull
            docker-compose -f docker-compose.prod.yml up -d

          EOF
          '''
        }
      }
    }
  }
}
