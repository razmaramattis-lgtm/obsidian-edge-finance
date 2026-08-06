import { useEffect, useState, ImgHTMLAttributes, AnchorHTMLAttributes } from "react";
import { resolveWorkspaceUrl, workspacePath } from "@/lib/workspaceStorage";

/** Resolves a stored workspace-uploads URL into a short-lived signed URL. */
export const useSignedUrl = (url?: string | null) => {
  const [signed, setSigned] = useState<string | null>(() =>
    workspacePath(url) ? null : (url ?? null)
  );

  useEffect(() => {
    let cancelled = false;
    if (!url) { setSigned(null); return; }
    if (!workspacePath(url)) { setSigned(url); return; }
    resolveWorkspaceUrl(url).then(u => { if (!cancelled) setSigned(u); });
    return () => { cancelled = true; };
  }, [url]);

  return signed;
};

type ImgProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & { src?: string | null };

export const SignedImg = ({ src, ...rest }: ImgProps) => {
  const signed = useSignedUrl(src);
  if (!signed) return null;
  return <img src={signed} {...rest} />;
};

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { href?: string | null };

export const SignedLink = ({ href, children, ...rest }: LinkProps) => {
  const signed = useSignedUrl(href);
  return (
    <a href={signed || undefined} {...rest}>
      {children}
    </a>
  );
};
