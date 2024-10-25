"use client";

import { Alert } from "@/components/alert";
import { resendVerification, sendVerification } from "@/lib/server/email";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, ButtonVariants } from "./button";
import { TextInput } from "./input";
import { Spinner } from "./spinner";

type Inputs = {
  code: string;
};

type Props = {
  userId: string;
  code?: string;
  isInvite: boolean;
  params: URLSearchParams;
};

export function VerifyForm({ userId, code, isInvite, params }: Props) {
  const t = useTranslations("verify");
  const tError = useTranslations("error");

  const { register, handleSubmit, formState } = useForm<Inputs>({
    mode: "onBlur",
    defaultValues: {
      code: code ?? "",
    },
  });

  const [error, setError] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    if (code) {
      submitCodeAndContinue({ code });
    }
  }, []);

  async function resendCode() {
    setLoading(true);

    const response = await resendVerification({
      userId,
      isInvite: isInvite,
    }).catch(() => {
      setError("Could not resend email");
      setLoading(false);
      return;
    });

    setLoading(false);
    return response;
  }

  async function submitCodeAndContinue(value: Inputs): Promise<boolean | void> {
    setLoading(true);

    const verifyResponse = await sendVerification({
      code: value.code,
      userId,
      isInvite: isInvite,
    }).catch(() => {
      setError("Could not verify user");
      setLoading(false);
      return;
    });

    setLoading(false);

    if (!verifyResponse) {
      setError("Could not verify user");
      return;
    } else {
      router.push("/authenticator/set?" + params);
    }
  }

  return (
    <>
      <form className="w-full">
        <div className="">
          <TextInput
            type="text"
            autoComplete="one-time-code"
            {...register("code", { required: "This field is required" })}
            label="Code"
          />
        </div>

        {error && (
          <div className="py-4">
            <Alert>{error}</Alert>
          </div>
        )}

        <div className="mt-8 flex w-full flex-row items-center">
          <Button
            type="button"
            onClick={() => resendCode()}
            variant={ButtonVariants.Secondary}
          >
            {t("verify.resendCode")}
          </Button>
          <span className="flex-grow"></span>
          <Button
            type="submit"
            className="self-end"
            variant={ButtonVariants.Primary}
            disabled={loading || !formState.isValid}
            onClick={handleSubmit(submitCodeAndContinue)}
          >
            {loading && <Spinner className="h-5 w-5 mr-2" />}
            {t("verify.submit")}
          </Button>
        </div>
      </form>
    </>
  );
}
