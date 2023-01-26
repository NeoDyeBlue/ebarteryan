export default function VerificationTemplate({ receiverName, otp }) {
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
            color: "#85CB33",
          }}
        >
          Welcome!
        </h1>
        <p style={{ padding: "1.5rem 0" }}>
          Hi <span style={{ fontWeight: "bold" }}>{receiverName}</span>,
        </p>
        <p style={{ paddingBottom: "1.5rem" }}>
          Welcome to eBarterYan! We're excited to have you get started. First,
          you need to confirm your account. Here is your 6 digit code.
        </p>
        <section style={{ padding: "2rem 0", textAlign: "center" }}>
          <p
            style={{
              color: "#000",
              textAlign: "center",
              display: "inline-block",
              fontWeight: "bold",
              letterSpacing: "1rem",
              fontSize: "2rem",
            }}
          >
            {otp}
          </p>
        </section>
        <p>Cheers,</p>
        <p>eBarterYan Team</p>
      </section>
    </body>
  );
}
