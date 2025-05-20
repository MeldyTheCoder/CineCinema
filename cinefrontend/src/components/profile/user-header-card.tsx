import { Grid, GridItem, Float, chakra, useFileUpload, FileUpload, IconButton } from "@chakra-ui/react";
import { TUser } from "../../types";
import { changeAvatarFx } from "../../effector/users.store";
import { MdPhotoCamera } from "react-icons/md";
import { Avatar } from "../ui/avatar";
import { toaster } from "../ui/toaster";
import { useEffect } from "react";

type TUserHeaderCard = {
  readonly disableUploadAvatar?: boolean;
  readonly user: TUser;
};


type UploadPhotoButtonProps = {
  readonly onUpload: (_: File) => void;
};


const FullNameSpan = chakra('h1', {
    base: {
        fontWeight: 'bold',
        fontSize: '24px',
    }
});

const DateRegSpan = chakra('span', {
    base: {
        fontWeight: 500,
        fontSize: '14px',
    }
});

export function UploadPhotoButton({ onUpload }: UploadPhotoButtonProps) {
  const fileUpload = useFileUpload({
    maxFiles: 1,
    onFileAccept: async ({files}) => {
      return onUpload?.(files[0]);
    },
  });

  return (
    <FileUpload.RootProvider value={fileUpload}>
      <FileUpload.HiddenInput />
      <FileUpload.Trigger asChild>
        <IconButton size="2xs" rounded="full">
          <MdPhotoCamera />
        </IconButton>
      </FileUpload.Trigger>
    </FileUpload.RootProvider>
  );
}

export function UserHeaderCard({ disableUploadAvatar, user }: TUserHeaderCard) {
  useEffect(() => {
    const destroyDoneAvatarListener = changeAvatarFx.done.watch(() => {
      toaster.create({
        title: "Изображение профиля успешно загружено!",
        type: 'success',
      })
    });

    const destroyFailAvatarListener = changeAvatarFx.fail.watch(() => {
      toaster.create({
        title: "Не удалось загрузить изображение профиля",
        description: "Повторите попытку позднее.",
        type: 'error',
      })
    });

    return () => {
      destroyDoneAvatarListener();
      destroyFailAvatarListener();
    }
  }, [])
  
  return (
    <Grid
      templateRows="repeat(2, 1fr)"
      templateColumns="repeat(12, 1fr)"
      alignItems="center"
      gapX="30px"
    >
      <GridItem colSpan={1} rowSpan={2}>
        <Avatar
          width={75}
          height={75}
          src={`http://localhost:8080/media/${user.avatar}`}
        >
          {!disableUploadAvatar && (
            <Float placement="bottom-end" offset={2}>
              <UploadPhotoButton onUpload={(file) => changeAvatarFx(file)} />
            </Float>
          )}
        </Avatar>
      </GridItem>
      <GridItem colSpan={10} rowSpan={1}>
        <FullNameSpan>
          {user.firstName} {user.lastName}
        </FullNameSpan>
      </GridItem>
      <GridItem colSpan={10} rowSpan={1}>
        <DateRegSpan>Дата регистрации: 21 сентября 2025</DateRegSpan>
      </GridItem>
    </Grid>
  );
}
