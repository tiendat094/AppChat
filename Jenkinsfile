pipeline {
    agent any

    environment{
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
        stage('Deploy Backend'){
            steps{
               script{
                  sshagent(['my-ssh-key']){
                      sh '
                         ssh -o StrictHostKeyChecking=no -l dominhdue 192.168.183.129
                         cd ${BE_PATH}
                         mvn clean package
                         cp ${BE_PATH}/target/*.jar ${BE_DEPLOY}/
                         sudo systemctl start AppChat.service
                         '
                  }
               }
            }
        }

        stage('Deploy FE'){
            steps{
                script{
                       sshagent(['my-ssh-key']){
                           sh '
                              ssh -o StrictHostKeyChecking=no -l dominhdue 192.168.183.129
                              rm -rf ${FE_PATH}/App_Chat/dist
                              cd ..
                              npm run build
                              sudo systemctl reload nginx
                              '
                       }
                }
            }
        }

        stage('SSH server'){
            steps{
              sshagent(['my-ssh-key']){
                 sh 'ssh -o StrictHostKeyChecking=no -l dominhdue 192.168.183.129 touch test1.txt'
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

