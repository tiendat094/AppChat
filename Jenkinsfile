pipeline {
    agent any

    environment{
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

        stage('Build BackEnd'){
            steps{
               dir('BE'){
                  sh 'mvn clean package -DskipTests'
               }
            }
        }

        stage('Build FrontEnd'){
            steps{
               dir('FE'){
                  sh 'npm install'
                  sh 'npm run build'
               }
            }
        }

        stage('Deploy Backend'){
            steps{
               sh '''
                  scp $BE_DEPLOY/target/*.jar $SERVER_USER@$SERVER_HOST:$BE_DEPLOY
                  ssh $SERVER_USER@$SERVER_HOST <<EOF
                  sudo systemctl restart AppChat.service
                  EOF
               '''
            }
        }

        stage('Deploy FrontEnd'){
            steps{
               sh '''
                        ssh $SERVER_USER@$SERVER_HOST <<EOF
                        rsync -avz --delete $SERVER_CODE_PATH/frontend/dist/ $FE_DEPLOY/
                        sudo systemctl reload nginx
                        EOF
                  '''
            }
        }

        stage('SSH server'){
            steps{
              sshagent(['my-ssh-key']){
                 sh 'ssh -o StrictHostKeyChecking=no -l dominhdue 192.168.183.129 '
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

