job("Build and push Docker") {
    startOn {
        gitPush {
            branchFilter = "+:<default>"
        }
    }

    steps {
        dockerBuild {
            name = "Build Docker image"
            file = "./Dockerfile"
            imageId = "cfr-r.divsphere.net/quote-frontend:latest"
            labels["vendor"] = "DigitalIndividuals"
        }

        dockerPush {
            name = "Push Docker image"
            imageId = "cfr-r.divsphere.net/quote-frontend:latest"
        }
    }
}
