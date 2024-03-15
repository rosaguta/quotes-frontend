job("Build and push Docker") {
    startOn {
        gitPush {
            anyBranchMatching {
                +"main"
            }
        }
    }
    host("Build artifacts and a Docker image") {
       dockerBuildPush {

            file = "./Dockerfile"
            labels["vendor"] = "DigitalIndividuals"

            tags {
                +"cfr-r.divsphere.net/quote-frontend:latest"
            }
        }
    }
}
