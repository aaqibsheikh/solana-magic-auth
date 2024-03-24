import { Magic } from 'magic-sdk';

const magicLinkKey = process.env.REACT_APP_MAGIC_LINK_KEY;
if (!magicLinkKey) {
  throw new Error("Magic Link key is not defined in environment variables.");
}

const magic = new Magic(magicLinkKey); // Uses your Magic Link key from the environment variable

export default magic;
