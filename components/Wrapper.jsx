import { useRouter } from "next/router";
import Image from "next/image";
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
        <div className="bg-white flex items-center justify-between px-3 p-4 md:p-10 md:px-40 shadow-lg">
          <p
            className="text-2xl md:text-5xl font-bold cursor-pointer "
            onClick={() => router.push("/")}
          >
            <Image
              className="bg-white"
              width={100}
              height={100}
              src="/kids.PNG"
              alt=""
            />
          </p>
          <div className="flex gap-2 items-center">
            <a
              href={button}
              className={`btn btn-primary md:rounded-full rounded-3xl font-bold p-6 md:p-8 border-none text-lg md:text-3xl ${textColor} ${color} `}
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
