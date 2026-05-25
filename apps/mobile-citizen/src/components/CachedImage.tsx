import { Image, type ImageProps } from "expo-image";
import { memo } from "react";

type CachedImageProps = Omit<ImageProps, "source"> & {
  uri: string | null | undefined;
};

export const CachedImage = memo(function CachedImage({ uri, ...props }: CachedImageProps) {
  if (!uri) return null;
  return (
    <Image
      source={{ uri }}
      cachePolicy="memory-disk"
      transition={200}
      contentFit="cover"
      {...props}
    />
  );
});
