export default function ResetTemplate({ receiverName, resetLink }) {
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
          Password Reset
        </h1>
        <p style={{ padding: "1.5rem 0" }}>
          Hi <span style={{ fontWeight: "bold" }}>{receiverName}</span>,
        </p>
        <p style={{ paddingBottom: "1.5rem" }}>
          You've requested for a password reset. Just press the button below to
          reset your password. If you're not the one who requested this, please
          ignore this email.
        </p>
        <section style={{ padding: "2rem 0", textAlign: "center" }}>
          <a
            href={resetLink}
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
            Reset
          </a>
        </section>
        <p style={{ padding: "1.5rem 0" }}>
          If that doesn't work, copy the link below:
        </p>
        <a
          target="_blank"
          href={resetLink}
          style={{
            color: "#85CB33",
            cursor: "pointer",
            paddingBottom: "1.5rem",
            display: "inline-block",
            textDecoration: "underline",
          }}
        >
          {resetLink}
        </a>
        <p>Cheers,</p>
        <p>eBarterYan Team</p>
      </section>
    </body>
  );
}
