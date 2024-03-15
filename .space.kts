job("Build and push Docker") {
    startOn {
        gitPush {
            anyBranchMatching {
                +"main"
            }
        }
    host("Build artifacts and a Docker image") {
       dockerBuildPush {

            file = "./Dockerfile"
            labels["vendor"] = "DigitalIndividuals"

            val spaceRepo = "cfr-r.divsphere.net/q-frontend:latest"
            // image tags for 'docker push'
            tags {
                +"cfr-r.divsphere.net/q-frontend:latest"
            }
        }
    }
}