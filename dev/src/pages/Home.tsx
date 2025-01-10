import Layout from './layout';
import Button from '@components/Button';
import AnimatedText from '@/components/AnimatedText';
import Logo from '@assets/coloring-book-logo-wide.svg?react';
import { BookOpenIcon } from '@heroicons/react/24/solid';

import HomeBackgroundSvg from '@assets/home_background.svg?react';

const MainCard = () => {
  return (
    <>
      {/* <img
        className="absolute top-0 left-0 w-full h-full opacity-50"
        src="mockup/home-2025-01-09.png"
        style={{
          filter: 'invert(100%)',
          objectFit: 'cover',
          objectPosition: 'center',
          width: '100%',
          height: '100%',
        }}
        alt=""
      /> */}

      {/* <div className="grid grid-cols-12"> */}
      {/* <div data-id="content" style={{ width: 400, height: 400 }}>
          <HomeBackgroundSvg className="w-full h-full" />
        </div> */}
      {/* </div> */}
    </>
  );
};

const HomePage: React.FC = () => {
  return (
    <Layout showHeader={false}>
      <div
        className="flex w-full w-screen h-screen items-center"
        style={{
          background: 'url(assets/home_background.svg) bottom right no-repeat',
        }}
      >
        {/* <img
          className="absolute top-0 left-0 w-full h-full opacity-50 pointer-events-none"
          src="mockup/home-2025-01-09.png"
          style={{
            filter: 'invert(100%)',
            objectFit: 'cover',
            objectPosition: 'center',
            width: '100%',
            height: '100%',
            top: '-60px',
          }}
          alt=""
        /> */}

        <div className="grid md:grid-cols-12 gap-4">
          <div className="lg:col-span-4"></div>
          <div
            className="md:col-start-3 md:col-span-3 lg:col-start-5 lg:col-span-2 text-white"
            style={{ border: '5px solid #fff;' }}
          >
            <Logo className="mb-4 -ml-16" />

            <AnimatedText enterClassName="delay-200">
              <div className="flex mb-4 gap-2 items-center text-md font-extralight">
                <span className="">Create</span>
                <span className="text-primary-200 bg-primary-900 p-1 px-2 rounded-md shadow-xl border border-primary-800">
                  color
                </span>
                <span className="">share</span>
              </div>
            </AnimatedText>

            <AnimatedText enterClassName="delay-300">
              <p className="text-sm mb-4 text-justify">
                <strong>Plongez dans un univers créatif et coloré</strong> où
                vous pouvez concevoir des motifs originaux, laisser libre cours
                à votre personnalité à travers le coloriage et partager vos
                créations avec notre communauté.
              </p>
            </AnimatedText>
            <AnimatedText enterClassName="delay-800">
              <p className="text-sm mb-4 text-indigo-500">
                Lancez-vous dès aujourd'hui :
              </p>
            </AnimatedText>
            <AnimatedText enterClassName="delay-500">
              <div>
                <Button className="flex justify-center w-full rounded-md py-1 px-2">
                  <BookOpenIcon aria-hidden="true" className="size-8" />
                  <span>Create new book</span>
                </Button>
              </div>
            </AnimatedText>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
