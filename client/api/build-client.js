import axios from "axios";

export default ({ req }) => {
  if (typeof window === "undefined") {
    // server

    // kubectl get namespaces
    // kubectl get services -n ingress-nginx
    // http://SERVICENAME.NAMESPACE.svc.cluster.local
    return axios.create({
      baseURL:
        "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
      headers: req.headers,
    });
  } else {
    // browser
    return axios.create({
      baseURL: "/",
    });
  }
};
