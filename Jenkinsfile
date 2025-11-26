pipeline {
    agent any

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/klu2300033555/elections-hub-frontend.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                bat 'docker build -t gopi/voting-frontend:latest .'
            }
        }

        stage('Push to DockerHub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
                    bat 'docker login -u %USERNAME% -p %PASSWORD%'
                }
                bat 'docker push gopi/voting-frontend:latest'
            }
        }
    }
}
