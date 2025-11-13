pipeline {
  agent any

  environment {
    DOCKERHUB = 'DOCKERHUB_USER'
    BACKEND_IMAGE = "venkatasivareddybhavanam834/simple-backend"
    FRONTEND_IMAGE = "venkatasivareddybhavanam834/simple-frontend"
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build Backend Image') {
      steps {
        dir('backend') {
          sh 'docker build -t $BACKEND_IMAGE:latest .'
        }
      }
    }

    stage('Build Frontend Image') {
      steps {
        dir('frontend') {
          sh 'docker build -t $FRONTEND_IMAGE:latest .'
        }
      }
    }

    stage('Login to DockerHub') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DH_USER', passwordVariable: 'DH_PASS')]) {
          sh 'echo $DH_PASS | docker login -u $DH_USER --password-stdin'
        }
      }
    }

    stage('Push images') {
      steps {
        sh 'docker push $BACKEND_IMAGE:latest'
        sh 'docker push $FRONTEND_IMAGE:latest'
      }
    }

    stage('Deploy to EC2') {
      steps {
        // deploy script that runs on EC2 to pull and restart compose
        withCredentials([sshUserPrivateKey(credentialsId: 'ec2-ssh-key', keyFileVariable: 'SSH_KEY', usernameVariable: 'SSH_USER')]) {
          sh '''
            chmod 600 $SSH_KEY
            # Copy docker-compose.prod.yml to EC2 (optional). We'll send it using scp.
            scp -o StrictHostKeyChecking=no -i $SSH_KEY docker-compose.prod.yml $SSH_USER@54.90.201.141:~/docker-compose.prod.yml

            # SSH and run pull & up
            ssh -o StrictHostKeyChecking=no -i $SSH_KEY $SSH_USER@54.90.201.141 << 'SSH_EOF'
              docker pull ${BACKEND_IMAGE}:latest
              docker pull ${FRONTEND_IMAGE}:latest
              docker-compose -f ~/docker-compose.prod.yml pull
              docker-compose -f ~/docker-compose.prod.yml up -d
              docker system prune -f
            SSH_EOF
          '''
        }
      }
    }
  }

  post {
    failure {
      emailext body: "Build failed", subject: "Jenkins: Build failed", to: "you@example.com"
    }
  }
}
