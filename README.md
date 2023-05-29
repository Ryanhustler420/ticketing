# Getting Started

```
install [Chocolaty](https://chocolatey.org/install)
install [Minikube](https://minikube.sigs.k8s.io/docs/start/)
install [Skaffold](https://skaffold.dev/docs/install/)
install ingress (https://kubernetes.io/docs/tasks/access-application-cluster/ingress-minikube/)
    - `minikube addons enable ingress`
```

##### Packages required

```cmd
npm install -g typescript @REM tsc --init, to generate tsconfig.json file in your project
```

##### Issues

- [Browser Not Loading The Host](https://stackoverflow.com/a/68966125)

##### Run

**Please Note**: you can test the ingress service via `minikube ssh`. by using `curl host.k8s.com`

1.  start docker
2.  `minikube start`
3.  `skaffold dev` [from root of your project]
4.  Set custom domain IP to 127.0.01 in `%WINDIR%\System32\drivers\etc\hosts` file, i.e. by adding line `127.0.0.1 my-k8s.com`
5.  Get ingress pod name: `kubectl get pods -n ingress-nginx` [Fix](https://kubernetes.io/docs/tasks/access-application-cluster/ingress-minikube/#enable-the-ingress-controller)
6.  Start port forwarding: `kubectl -n ingress-nginx port-forward pod/ingress-nginx-controller-5d88495688-dxxgw --address 0.0.0.0 80:80 443:443`, where you should replace `ingress-nginx-controller-5d88495688-dxxgw` with your ingress pod name.
7.  Enjoy using ingress on custom domain in any browser (but only when port forwarding is active)
8. `skaffold delete` to delete deployment and services at once

##### Common code share between services

- Create an NPM registry
- Create an public organization ex `ticketing-k8s`
- Create `/common` folder in the project and make a `package.json` with `npm init`
- Change the `name` field in **package.json** to `@ticketing-k8s/common`
- Open the `/common` directory in a terminal
- Create a new git repository **We must have commited to git** before we pusblish it, because npm checks it before publishing everything need to be created
- run `git init` -> `git add .` -> `git commit -m "initial commit"`
- run `npm login` -> `npm publish --access public`
- run `tsc --init` -> `npm i typescript del-cli --save-dev`
- create new folder `/src` inside `/common`
- create `/src/index.ts` file
- create some intefaces and stuff for testing
- modify the `package.json` scripts section and add `build` command to it which will transpile the `.ts` file to `.js` file
- change `"declaration": true,` and `"outDir": "./build",` inside `tsconfig.json`
- commit the code and run `npm version patch`

##### Secrets in k8s

- `kubectl create secret generic name-secret --from-literal=NAME_KEY=xxxxxxxxxx -n default`
- `kubectl get secrets -n default`
- `kubectl delete secrets name-secret -n default`

##### Google Cloud Platform Setup

1.  Create a free account [Required Credit Card]
2.  Create a new project
3.  Select the newly created project
4.  Select Kubernetes Engine > Clusters
5.  Select create cluster
6.  Fill the name, zone, master_version(1.15xx atleast)
7.  Fill the node pools details, size(3), Machine Type
8.  Click create

9.  Configure `kubectl` context or download `google cloud sdk` to automatically manage `kubectl` contex so it will point to server's cluster
10. practice on digital ocean
