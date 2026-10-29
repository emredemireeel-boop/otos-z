'use client';
export default function ContactFormClient({children}:{children:React.ReactNode}){
    return <form style={{display:'flex',flexDirection:'column',gap:20}} onSubmit={event=>{
        event.preventDefault();window.location.href='mailto:iletisim@otosoz.com?subject=Destek Talebi';
    }}>{children}</form>;
}
