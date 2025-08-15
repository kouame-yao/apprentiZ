import { useRouter } from "next/router";
export default function Wrapper({
  children,
  name,
  button,
  color,
  textColor,
  btnLogoutName,
  btnLogoutClass,
  btnLogoutClick,
}) {
  const router = useRouter();
  return (
    <div>
      <main>
        <div className="bg-white flex items-center  p-4 px-10 md:p-10 md:px-40 shadow-lg w-full">
          <p
            className="text-2xl md:text-5xl font-bold cursor-pointer "
            onClick={() => router.push("/")}
          >
            <img
              src="/kids.png"
              alt="Enfants qui apprennent avec l'application"
              style={{
                width: "40%",
              }}
            />
          </p>
          <div className="flex gap-2 items-center">
            <a
              href={button}
              className={`btn btn-primary md:rounded-full rounded-3xl font-bold py-2 md:p-8 border-none text-lg md:text-3xl ${textColor} ${color} `}
            >
              {name}
            </a>
            <button onClick={btnLogoutClick} className={btnLogoutClass}>
              {btnLogoutName}
            </button>
          </div>
        </div>
      </main>
      <div className="mt-8"> {children} </div>
    </div>
  );
}
