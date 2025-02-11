pipeline {
    agent any

    environment {
        VERSION = "v${BUILD_NUMBER}"
        BE_PATH = "/var/www/AppChat/AppChat/BE"
        FE_PATH = "/var/www/AppChat/AppChat/FE"
        BE_DEPLOY = "/opt/AppChatBe"
        SERVER_USER = "dominhdue"
        SERVER_HOST = "192.168.183.129"
    }

    stages {
        stage('Clone') {
            steps {
                git branch: 'main', url: 'https://github.com/tiendat094/AppChat.git'
            }
        }

        stage('Deploy Backend') {
            steps {
                sshagent(['my-ssh-key']) {
                    sh """
                        ssh -o StrictHostKeyChecking=no ${SERVER_USER}@${SERVER_HOST} "
                        cd ${BE_PATH} &&
                        mvn clean package &&
                        cp ${BE_PATH}/target/*.jar ${BE_DEPLOY}/ &&
                        sudo systemctl restart AppChat.service"
                    """
                }
            }
        }

        stage('Deploy Frontend') {
            steps {
                sshagent(['my-ssh-key']) {
                    sh """
                        ssh -o StrictHostKeyChecking=no ${SERVER_USER}@${SERVER_HOST} "
                        rm -rf ${FE_PATH}/App_Chat/dist &&
                        cd ${FE_PATH} &&
                        npm install &&
                        npm run build &&
                        sudo systemctl reload nginx"
                    """
                }
            }
        }

        stage('SSH server') {
            steps {
                sshagent(['my-ssh-key']) {
                    sh """
                        ssh -o StrictHostKeyChecking=no ${SERVER_USER}@${SERVER_HOST} "touch ~/test1.txt"
                    """
                }
            }
        }
    }

    post {
        success {
            echo "✅ Build & Deploy thành công!"
        }
        failure {
            echo "❌ Build & Deploy thất bại!"
        }
    }
}
