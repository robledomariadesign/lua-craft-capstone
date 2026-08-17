import { existsSync } from 'node:fs'
import { join } from 'node:path'
import VersionAClient from '@/components/VersionAClient'

// Swappable proof image: drop a file at public/proof.png and the next build picks
// it up. No code change, and no 404 in the console while there isn't one.
const proofSrc = existsSync(join(process.cwd(), 'public', 'proof.png')) ? '/proof.png' : null

export default function VersionAPage() {
  return <VersionAClient proofSrc={proofSrc} />
}
