import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

import { Eye, EyeOff } from 'lucide-react';
import { Save } from 'lucide-react';

import ModalBasic from '@/components/modals/modal-basic';
import { ButtonMatcha } from '@/components/ui/button-matcha';
import { Label } from '@/components/ui/label';
import { RequiredInput } from '@/components/ui/required-input';
import useUserStore from '@/stores/user';
import { TUser } from '@/types/user';

const ModalChangeEmail = ({
  show,
  setShow,
}: {
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
}) => {
  const t = useTranslations();
  const { user, setUser } = useUserStore((state) => ({
    user: state.user,
    setUser: state.setUser,
  }));
  const formRef = useRef<HTMLFormElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    const currentForm = formRef.current;
    if (!currentForm) return;

    const formData = new FormData(currentForm);
    //const data = Object.fromEntries(formData.entries());
    const newEmail = formData.get('email-new');
    const confirmEmail = formData.get('email-confirm');

    if (newEmail !== confirmEmail) {
      setError(t('email-mismatch'));
      setLoading(false);
      return;
    }

    if (newEmail === user?.email) {
      setSuccessMessage(t('data-is-up-to-date'));
      setLoading(false);
      return;
    }

    let response: any;
    try {
      response = await fetch(`/api/profile/update/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: user?.id,
          email: newEmail,
          password: formData.get('password'),
        }),
      });

      const result = await response.json();
      const updatedUserData: TUser = result.user;
      if (response.ok) {
        setSuccessMessage(t(result.message));
        if (updatedUserData) {
          setUser({ ...user, ...updatedUserData });
        }
      } else {
        setError(t(result.error));
      }
    } catch (error) {
      setError(t(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalBasic isOpen={show} setIsOpen={setShow} title={t('email-change')}>
      <div className="flex min-h-[30vh] flex-col items-center justify-center space-y-5 text-center">
        <p>
          {t('email-current')}
          {': '}
          <span className="italic">{user?.email}</span>
        </p>
        <form
          className="flex flex-col items-center justify-center text-left align-middle"
          onSubmit={handleSubmit}
          ref={formRef}
        >
          <div className="flex flex-col">
            <div className="flex flex-col">
              <Label htmlFor="email-new" className="mb-2">
                {t(`email-new`)}
              </Label>
              <RequiredInput
                type="email"
                id="email-new"
                name="email-new"
                placeholder={t(`email-new-enter`)}
                autoComplete="email"
                maxLength={42}
                className="mb-2"
              />
            </div>
            <div className="flex flex-col">
              <Label htmlFor="email-confirm" className="mb-2">
                {t(`email-new-confirmation`)}
              </Label>
              <RequiredInput
                type="email"
                id="email-confirm"
                name="email-confirm"
                placeholder={t(`email-new-enter-again`)}
                autoComplete="new-email-confirmation"
                maxLength={42}
                className="mb-2"
              />
            </div>
            <div className="flex flex-col">
              <Label htmlFor="password" className="mb-2">
                {t(`auth.password`)}
              </Label>
              <div className="relative">
                <RequiredInput
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  placeholder={t(`auth.password`)}
                  autoComplete="current-password"
                  errorMessage={t(`auth.password-requirements`)}
                  minLength={8}
                  maxLength={21}
                  pattern="^(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])(?=.*[@$!%*?&,.^=_+])[A-Za-z0-9@$!%*?&,.^=_+]{8,21}$"
                  className="mb-5"
                />
                <button
                  type="button"
                  className="absolute right-2 top-2 text-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>
          </div>

          <ButtonMatcha type="submit" size="icon" loading={loading} title={t('save')}>
            <Save size={24} />
          </ButtonMatcha>
        </form>
        <div className="min-h-6">
          {error && <p className="mb-5 text-center text-sm text-negative">{error}</p>}
          {successMessage && (
            <p className="mb-5 text-center text-sm text-positive">{successMessage}</p>
          )}
        </div>
      </div>
    </ModalBasic>
  );
};

export default ModalChangeEmail;
