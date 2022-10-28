import { generate } from "text-to-image";

export async function generateAvatarFromInitial(character) {
  let max = 256;
  let textColor = "";
  let red = Math.floor(Math.random() * max);
  let green = Math.floor(Math.random() * max);
  let blue = Math.floor(Math.random() * max);

  if (
    Math.sqrt(red ** 2 * 0.241 + green ** 2 * 0.691 + blue ** 2 * 0.068) > 145
  ) {
    textColor = "black";
  } else {
    textColor = "white";
  }

  const initial_image = await generate(character, {
    bgColor: `rgb(${red} ${green} ${blue})`,
    textColor,
    textAlign: "center",
    maxWidth: 300,
    customHeight: 300,
    verticalAlign: "center",
    fontSize: 128,
  });

  return initial_image;
}
