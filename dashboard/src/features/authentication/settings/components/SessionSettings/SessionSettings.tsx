import { useUI } from '@/components/common/UIProvider';
import { Form } from '@/components/form/Form';
import { SettingsContainer } from '@/components/layout/SettingsContainer';
import { ActivityIndicator } from '@/components/ui/v2/ActivityIndicator';
import { Input } from '@/components/ui/v2/Input';
import { useCurrentWorkspaceAndProject } from '@/features/projects/common/hooks/useCurrentWorkspaceAndProject';
import {
  GetAuthenticationSettingsDocument,
  useGetAuthenticationSettingsQuery,
  useUpdateConfigMutation,
} from '@/generated/console-graphql';
import { getToastStyleProps } from '@/utils/constants/settings';
import { getServerError } from '@/utils/getServerError';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  accessTokenExpiresIn: Yup.number()
    .label('Access token expiration')
    .typeError('Access token expiration must be a number')
    .required(),
  refreshTokenExpiresIn: Yup.number()
    .label('Refresh token expiration')
    .typeError('Refresh token expiration must be a number')
    .required(),
});

export type SessionFormValues = Yup.InferType<typeof validationSchema>;

export default function SessionSettings() {
  const { maintenanceActive } = useUI();
  const { currentProject } = useCurrentWorkspaceAndProject();
  const [updateConfig] = useUpdateConfigMutation({
    refetchQueries: [GetAuthenticationSettingsDocument],
  });

  const { data, loading, error } = useGetAuthenticationSettingsQuery({
    variables: { appId: currentProject?.id },
    fetchPolicy: 'cache-only',
  });

  const { accessToken, refreshToken } = data?.config?.auth?.session || {};

  const form = useForm<SessionFormValues>({
    reValidateMode: 'onSubmit',
    defaultValues: {
      accessTokenExpiresIn: accessToken?.expiresIn || 900,
      refreshTokenExpiresIn: refreshToken?.expiresIn || 43200,
    },
    resolver: yupResolver(validationSchema),
  });

  if (loading) {
    return (
      <ActivityIndicator
        delay={1000}
        label="Loading session settings..."
        className="justify-center"
      />
    );
  }

  if (error) {
    throw error;
  }

  const { register, formState } = form;
  const isDirty = Object.keys(formState.dirtyFields).length > 0;

  const handleSessionSettingsChange = async (formValues: SessionFormValues) => {
    const updateConfigPromise = updateConfig({
      variables: {
        appId: currentProject.id,
        config: {
          auth: {
            session: {
              accessToken: { expiresIn: formValues.accessTokenExpiresIn },
              refreshToken: { expiresIn: formValues.refreshTokenExpiresIn },
            },
          },
        },
      },
    });

    try {
      await toast.promise(
        updateConfigPromise,
        {
          loading: `Session settings are being updated...`,
          success: `Session settings have been updated successfully.`,
          error: getServerError(
            `An error occurred while trying to update the project's session settings.`,
          ),
        },
        getToastStyleProps(),
      );

      form.reset(formValues);
    } catch {
      // Note: The toast will handle the error.
    }
  };

  return (
    <FormProvider {...form}>
      <Form onSubmit={handleSessionSettingsChange}>
        <SettingsContainer
          title="Session"
          description="Change the expiration time of the access and refresh tokens."
          slotProps={{
            submitButton: {
              disabled: !isDirty || maintenanceActive,
              loading: formState.isSubmitting,
            },
          }}
          className="grid grid-cols-5 grid-rows-2 gap-y-6"
        >
          <Input
            {...register('accessTokenExpiresIn')}
            id="accessTokenExpiresIn"
            type="number"
            label="Access Token Expires In (Seconds)"
            fullWidth
            className="col-span-5 lg:col-span-2"
            error={Boolean(formState.errors.accessTokenExpiresIn?.message)}
            helperText={formState.errors.accessTokenExpiresIn?.message}
          />

          <Input
            {...register('refreshTokenExpiresIn')}
            id="refreshTokenExpiresIn"
            type="number"
            label="Refresh Token Expires In (Seconds)"
            fullWidth
            className="col-span-5 row-start-2 lg:col-span-2"
            error={Boolean(formState.errors.refreshTokenExpiresIn?.message)}
            helperText={formState.errors.refreshTokenExpiresIn?.message}
          />
        </SettingsContainer>
      </Form>
    </FormProvider>
  );
}
