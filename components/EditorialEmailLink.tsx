import 'server-only';

// Cloudflare's documented per-address exception preserves a usable mailto in
// server HTML instead of introducing a /cdn-cgi/l/email-protection crawler link.
// Both strings are fixed editorial contact details, never user-supplied HTML.
const contact='<!--email_off--><a href="mailto:iletisim@otosoz.com">iletisim@otosoz.com</a><!--/email_off-->';
const correction='<!--email_off--><a href="mailto:iletisim@otosoz.com?subject=İçerik%20düzeltme%20talebi">iletisim@otosoz.com</a><!--/email_off-->';
export default function EditorialEmailLink({forCorrection=false}:{forCorrection?:boolean}){
    return <span dangerouslySetInnerHTML={{__html:forCorrection?correction:contact}}/>;
}
