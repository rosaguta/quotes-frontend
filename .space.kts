job("Build and push Docker") {
    host("Build artifacts and a Docker image") {
       dockerBuildPush {
            // Docker context, by default, project root
            context = "docker"
            // path to Dockerfile relative to project root
            // if 'file' is not specified, Docker will look for it in 'context'/Dockerfile
            file = "./Dockerfile"
            labels["vendor"] = "DigitalIndividuals"

            val spaceRepo = "cfr-r.divsphere.net/q-frontend"
            // image tags for 'docker push'
            tags {
                +"$quotes-frontend:latest"
            }
        }
    }
}