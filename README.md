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
6.  Start port forwarding: `kubectl port-forward pod/ingress-nginx-controller-5d88495688-dxxgw --address 0.0.0.0 80:80 443:443 -n ingress-nginx`, where you should replace `ingress-nginx-controller-5d88495688-dxxgw` with your ingress pod name.
7.  Enjoy using ingress on custom domain in any browser (but only when port forwarding is active)
8.  `skaffold delete` to delete deployment and services at once

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

##### Best Practice

> Always checkout new branch for your `next feature`

##### Digital Ocean Setup

> Create a project

> Create a k8s cluster with atleast 3 node

> install `[doctl](https://docs.digitalocean.com/reference/doctl/how-to/install/)` cli on your local machine

```cmd
Invoke-WebRequest https://github.com/digitalocean/doctl/releases/download/v1.94.0/doctl-1.94.0-windows-amd64.zip -OutFile ~\doctl-1.94.0-windows-amd64.zip
Expand-Archive -Path ~\doctl-1.94.0-windows-amd64.zip
Now set the exe file to PATH VARIABLE of your system
```

> Create an API key from `digital ocean` dashboard

> Run `doctl auth init` hit enter and paste the API TOKEN [You should be authenticated]

> Run `doctl kubernetes cluster kubeconfig save <cluster_name>` where `cluster_name` should be `ticketing-k8s`

> Run to verify `doctl get nodes`

> Run `kubectl config view` to see all the different context you have access to

> Run `kubectl config use-context <context_name>` where `context_name` shoulbe be `minikube`

> Create `secret env variables` on the respository to refer inside `workflow` files.

> Create a workflow file to apply all the `infra/k8s` and `infra/k8s-prod` manifest files to `ticketing-k8s`

> Create bunch of workflow files to automate the re-deployments

> Run `kubectl config use-context do-blr1-ticketing-k8s`

```cmd
kubectl create secret generic jwt-secret --from-literal=JWT_KEY=xxxxxxxxxx
kubectl create secret generic razorpay-key-id-secret --from-literal=RAZORPAY_KEY_ID=xxxxxxxxxx
kubectl create secret generic razorpay-key-secret-secret --from-literal=RAZORPAY_KEY_SECRET=xxxxxxxxxx
```

> Run `kubectl get secrets`

> Enable ingress to cluster for incoming traffic using [this](https://kubernetes.github.io/ingress-nginx/deploy/#digital-ocean)

```cmd
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.0/deploy/static/provider/do/deploy.yaml
kubectl apply -f https://gist.githubusercontent.com/Ryanhustler420/b86e46c4e7bd10f6fca04314fc85680e/raw/121fafbfda3f565c452ff7e6b9ca8c9e94a91ab9/ingress-nginx-controller-v1.8.0-digital-ocean-deploy.yaml
```

> Buy a domain name i.e www.something.com

> Add these details to `CustomDNS`

```cmd
ns1.digitalocean.com
ns2.digitalocean.com
ns3.digitalocean.com
```

> Go to digital ocean's `Networks` under domain tab and add your domain name

```
Create some records for your domain.com

A
@       <Load Balance>      30
CNAME
www     @                   30
```

> Change your `k8s-prod/ingress-srv.yaml` host to `www.domain.com`

#### Init

For the fist time we'll commit to master,
