pipeline {
    agent any

    stages {
        stage('Clone') {
            steps {
                git branch: 'main', url: 'https://github.com/tiendat094/AppChat.git'
            }
        }
        stage('SSH server'){
            steps{
              sshagent(['my-ssh-key']){
                 sh 'ssh -o StrictHostKeyChecking=no -l dominhdue 192.168.183.129 touch test.txt'
              }
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
