
const Footer = () => {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-[#f0f6ff]">
      <div className="border-t py-8  text-center">
        © {year} FastConvert. Made with ❤️ by{" "}
        <a
          href="https://orji-dominion.vercel.app/"
          className="underline hover:text-blue-600 transition-colors"
        >
          DOMINION
        </a>
      </div>
    </footer>
  )
}

export default Footer
