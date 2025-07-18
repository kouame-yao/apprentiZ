export default function Wrapper({ children, nav }) {
  return (
    <div>
      <main>
        <div className="bg-white flex items-center justify-between px-3 p-4 md:p-6 md:px-30 shadow-lg">
          <p className="text-2xl font-bold ">EduKids</p>
          <button className="btn btn-primary rounded-3xl font-bold p-6 border-none text-lg text-white bg-green-500">
            {nav}
          </button>
        </div>
      </main>
      <div className="mt-8"> {children} </div>
    </div>
  );
}
