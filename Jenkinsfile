pipeline {
    agent any

    tools {
        nodejs "nodejs-23" // Ensure this matches the name in Global Tool Configuration
    }

    environment {
        MONGODB_STRING="mongodb+srv://admin:admin1234@cluster0.iuf6v.mongodb.net/Ecom?retryWrites=true&w=majority"
        PORT=4000
        JWT_SECRET_KEY="ECommerceAPI"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/jeje0883/e-comm.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }

        // stage('Test') {
        //     steps {
        //         bat 'npm test'
        //     }
        // }

        stage('Deploy') {
            steps {
                bat 'start /b npm start'
            }
        }
    }

    post {
        success {
            echo 'Deployment succeeded!'
        }
        failure {
            echo 'Deployment failed.'
        }
    }
}
