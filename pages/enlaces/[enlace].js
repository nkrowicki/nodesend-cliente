import Layout from "../../components/Layout";
import clienteAxios from "../../config/axios";

export async function getStaticProps({ params }) {
  const { enlace } = params;

  const resultado = await clienteAxios.get(`/api/enlaces/${enlace}`);
  console.log(resultado);

  return {
    props: {
      enlace: resultado.data,
    },
  };
}

export async function getStaticPaths() {
  const enlaces = await clienteAxios.get("/api/enlaces");

  return {
    paths: enlaces.data.enlaces.map((enlace) => ({
      params: {
        enlace: enlace.url,
      },
    })),
    fallback: false,
  };
}

export default () => {
  return (
    <Layout>
      <h1 className="text-4xl text-center text-gray-700">
        Descarga tu archivo
      </h1>
      <div className="flex item-center justify-center mt-10">
        <a
          href={`${process.env.backendURL}/api/archivos/${enlace.archivo}`}
          download
          className="bg-red-500 text-center px-10 py-3 rounded uppercase font-bold text-white cursor-pointer"
        >
          Aquí
        </a>
      </div>
    </Layout>
  );
};
