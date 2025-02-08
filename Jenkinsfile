pipeline {
    agent any

    stages {
        stage('Clone') {
            steps {
                git branch: 'main', url: 'https://github.com/tiendat094/AppChat.git'
            }
        }
    }

    post {
        success {
            echo "✅ Clone thành công!"
        }
        failure {
            echo "❌ Clone thất bại!"
        }
    }
}
