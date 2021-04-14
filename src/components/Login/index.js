import api from "../../services/api";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useHistory } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { User } from "../../providers/UserProvider";

import { Button, Input } from "../../stylesGlobal";
import { Boxes, Content } from "./style";
import { Token } from "../../providers/TokenProvider";

const Login = () => {
  const { id, setId, loggedUser, userCountClick, setUserCountClick } = User();

  const history = useHistory();
  const { token } = Token();
  const handleData = (dados) => {
    console.log(dados);
    setUserCountClick(userCountClick + 1);
    api
      .post("/login", dados)
      .then((response) => {
        console.log(response);
        localStorage.clear();
        localStorage.setItem(
          "token",
          JSON.stringify(response.data.accessToken)
        );
        setId(jwt_decode(localStorage.getItem("token")).sub);
        history.push("/home");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const schema = yup.object().shape({
    email: yup.string().required("Campo obrigatório"),
    password: yup.string().required("Campo obrigatório"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  if (token) {
    history.push("/home");
  }

  return (
    <div>
      <Boxes>
        <span></span>
        <Content>
          <form onSubmit={handleSubmit(handleData)}>
            <div>
              <Input
                {...register("email")}
                placeholder="E-mail"
                error={!!errors.email}
              />
              <p style={{ color: "red" }}>{errors.email?.message}</p>
            </div>
            <div>
              <Input
                {...register("password")}
                placeholder="Senha"
                error={!!errors.password}
              />
            </div>
            <p style={{ color: "red" }}>{errors.password?.message}</p>
            <Button type="submit">Login </Button>
          </form>
        </Content>
      </Boxes>
    </div>
  );
};

export default Login;
