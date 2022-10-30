export default function VerificationTemplate({
  receiverName,
  verificationLink,
}) {
  return (
    <body>
      <section
        style={{
          padding: "2rem",
          color: "#404040",
          fontSize: "1.25rem",
          fontFamily: "helvetica, sans-serif",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            textTransform: "capitalize",
            marginTop: 0,
            fontSize: "3rem",
            fontWeight: "bold",
            color: "#100B00",
          }}
        >
          Welcome!
        </h1>
        <p style={{ padding: "1.5rem 0" }}>
          Hi <span style={{ fontWeight: "bold" }}>{receiverName}</span>,
        </p>
        <p style={{ paddingBottom: "1.5rem" }}>
          Welcome to eBarterYan! We're excited to have you get started. First,
          you need to confirm your account. Just press the button below.
        </p>
        <section style={{ padding: "2rem 0", textAlign: "center" }}>
          <a
            href={verificationLink}
            target="_blank"
            style={{
              padding: "1.5rem",
              backgroundColor: "#85CB33",
              color: "#fff",
              textAlign: "center",
              borderRadius: "10px",
              cursor: "pointer",
              display: "inline-block",
            }}
          >
            Confirm Account
          </a>
        </section>
        <p style={{ padding: "1.5rem 0" }}>
          If that doesn't work, copy the link below:
        </p>
        <a
          target="_blank"
          href={verificationLink}
          style={{
            color: "#85CB33",
            cursor: "pointer",
            paddingBottom: "1.5rem",
            display: "inline-block",
            textDecoration: "underline",
          }}
        >
          {verificationLink}
        </a>
        <p>Cheers,</p>
        <p>eBarterYan Team</p>
      </section>
    </body>
  );
}
