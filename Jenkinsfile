pipeline {
    agent any

    tools {
        nodejs 'Node22'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Clean Reports') {
            steps {
                sh 'rm -rf reports/allure-results reports/allure-report reports/screenshots'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
                sh 'npx playwright install chromium'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npm test'
            }
        }

        stage('Allure Report') {
            steps {
                allure([
                    includeProperties: false,
                    jdk: '',
                    commandline: 'allure',
                    results: [[path: 'reports/allure-results']]
                ])
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'reports/allure-results/**', allowEmptyArchive: true
            allure([
                includeProperties: false,
                jdk: '',
                commandline: 'allure',
                results: [[path: 'reports/allure-results']]
            ])
        }
        failure {
            echo '❌ Pipeline falló — revisar reporte'
        }
        success {
            echo '✅ Todos los tests pasaron'
        }
    }
}