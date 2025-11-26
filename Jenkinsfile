pipeline {
    agent any

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/klu2300033555/elections-hub-frontend.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t gopigowd/voting-frontend:latest .'
            }
        }

        stage('Push to DockerHub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
                    sh 'echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin'
                    sh 'docker push gopigowd/voting-frontend:latest'
                }
            }
        }
    }
}
