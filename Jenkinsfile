pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Backend Dependencies') {
            steps {
                bat 'python --version'
                bat 'pip install -r backend\\requirements.txt'
            }
        }

        stage('Frontend Dependencies') {
            steps {
                bat 'cd frontend && npm ci'
            }
        }

        stage('Frontend Build') {
            steps {
                bat 'cd frontend && npm run build'
            }
        }

        stage('Backend Docker Build') {
            steps {
                bat '"C:\\Users\\yella\\AppData\\Local\\Programs\\DockerDesktop\\resources\\bin\\docker.exe" build -t ecommerce-platform-backend:jenkins ./backend'
            }
        }

        stage('Frontend Docker Build') {
            steps {
                bat '"C:\\Users\\yella\\AppData\\Local\\Programs\\DockerDesktop\\resources\\bin\\docker.exe" build -t ecommerce-platform-frontend:jenkins ./frontend'
            }
        }
    }

    post {
        success {
            echo 'Jenkins pipeline completed successfully!'
        }

        failure {
            echo 'Jenkins pipeline failed.'
        }
    }
}