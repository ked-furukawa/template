import { Authenticator, translations } from '@aws-amplify/ui-react';
import { I18n } from 'aws-amplify/utils';
import { Route, Routes } from 'react-router-dom';
import { AppLayout } from '@/app/layout/AppLayout';
import { Home } from '@/features/home/Home';
import { Items } from '@/features/items/Items';

I18n.putVocabularies(translations);
I18n.setLanguage('ja');

export function App() {
  return (
    <Authenticator hideSignUp>
      {({ signOut, user }) => (
        <AppLayout user={user} onSignOut={signOut}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/items" element={<Items />} />
          </Routes>
        </AppLayout>
      )}
    </Authenticator>
  );
}
