import { useState } from "react";
import Sign_up from "../../components/login/Sign_up";
import Signe_in from "../../components/login/Signe_in";

function login() {
  const [toggle, setToggle] = useState("Se connecter");
  const button = [{ name: "Se connecter" }, { name: "S'inscrire" }];

  return (
    <main className="bg-white rounded-2xl px-4 py-10 space-y-6 md:px-10 md:py-16 h-auto max-w-md md:max-w-lg mx-4 md:mx-auto mt-20">
      <section className="grid space-y-8">
        <div className="grid text-center space-y-2 md:space-y-4">
          <div className="w-full grid justify-center">
            <img
              src="/kids.PNG"
              className="place-items-center"
              width={100}
              alt=""
            />
          </div>
          <p className="text-gray-700 text-sm md:text-lg">
            {toggle === "Se connecter"
              ? "Connecte-toi pour continuer"
              : "Crée ton compte"}
          </p>
        </div>

        <div className="bg-gray-200 p-1 rounded-full w-full flex space-x-1 md:space-x-2">
          {button.map((item, index) => {
            const active =
              item.name === toggle
                ? "bg-violet-400 text-white font-semibold"
                : "text-gray-700";
            return (
              <button
                key={index}
                onClick={() => setToggle(item.name)}
                className={`${active} p-2 md:p-3 rounded-full w-full transition-colors duration-200`}
              >
                {item.name}
              </button>
            );
          })}
        </div>
      </section>

      <section>
        {toggle === "Se connecter" && <Signe_in />}
        {toggle === "S'inscrire" && <Sign_up />}
      </section>
    </main>
  );
}

export default login;
