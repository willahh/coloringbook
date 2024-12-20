import Layout from './layout';
import Pages from '@/components/pages/Pages';

const BookPage: React.FC = () => {
  return (
    <Layout aside={<Pages className={``} />}>
      <main className="flex-1 ">
        <p>Content</p>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </main>
    </Layout>
  );
};

export default BookPage;
