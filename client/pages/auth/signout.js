import Router from "next/router";
import { useEffect } from "react";
import useRequest from "../../hooks/use-request";

export default () => {
  const { doRequest } = useRequest({
    method: "post",
    url: "/api/users/signout",
    body: {},
    onSuccess: () => Router.push("/"),
  });

  useEffect(() => {
    doRequest();
  }, []);

  return <div>Signing you out...</div>;
};
