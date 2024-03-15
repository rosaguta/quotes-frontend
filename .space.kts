job("Build and push Docker") {
    startOn {
        gitPush {
            anyBranchMatching {
                +"main"
            }
        }

        file = "./Dockerfile"
        labels["vendor"] = "DigitalIndividuals"
        // image tags for 'docker push'
        tags {
            +"cfr-r.divsphere.net/q-frontend:latest"
        }
        
    }
}