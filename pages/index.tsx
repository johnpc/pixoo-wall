import * as React from "react";
import { CssVarsProvider, useColorScheme } from "@mui/joy/styles";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import Chip from "@mui/joy/Chip";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemContent from "@mui/joy/ListItemContent";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import ListDivider from "@mui/joy/ListDivider";
import Avatar from "@mui/joy/Avatar";
import AspectRatio from "@mui/joy/AspectRatio";
import Image from "next/image";
import { Schema } from "@/amplify/data/resource";
import { generateClient } from "aws-amplify/api";
import { Amplify } from "aws-amplify";
import config from "../amplify_outputs.json";
import { getCurrentMessage } from "@/helpers/get-current-message";
import wallboardImage from "../public/pixoo-wallboard.png";
import Link from "next/link";
import QuestionAnswer from "@mui/icons-material/QuestionAnswer";
import { createAIHooks } from "@aws-amplify/ui-react-ai";
import { CircularProgress } from "@mui/joy";

Amplify.configure(config);
const client = generateClient<Schema>();
const { useAIGeneration } = createAIHooks(client);
const sheetCss = {
  width: 500,
  mx: "auto", // margin left & right
  my: 4, // margin top & bottom
  py: 3, // padding top & bottom
  px: 2, // padding left & right
  display: "flex",
  flexDirection: "column",
  gap: 2,
  borderRadius: "sm",
  boxShadow: "md",
};
const inset = "startContent" as
  | undefined
  | "gutter"
  | "startDecorator"
  | "startContent";

function ModeToggle() {
  const { mode, setMode } = useColorScheme();
  const [mounted, setMounted] = React.useState(false);

  // necessary for server-side rendering
  // because mode is undefined on the server
  React.useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return null;
  }

  return (
    <Button
      variant="soft"
      onClick={() => {
        setMode(mode === "light" ? "dark" : "light");
      }}
    >
      {mode === "light" ? "Dark Mode" : "Light Mode"}
    </Button>
  );
}

export default function Home() {
  const [{ data, isLoading, hasError }, generateMessage] =
    useAIGeneration("generateMessage");

  console.log({ data });
  if (hasError) {
    console.log({ hasError, data });
  }
  const handleClick = () => {
    generateMessage({
      description:
        "Invent a message similar to the others that have been posted",
    });
  };
  const [currentMessage, setCurrentMessage] =
    React.useState<Schema["Message"]["type"]>();
  const [messages, setMessages] = React.useState<Schema["Message"]["type"][]>(
    []
  );
  const [buttonDisabled, setButtonDisabled] = React.useState<boolean>(true);

  const sortMessages = (
    a: Schema["Message"]["type"],
    b: Schema["Message"]["type"]
  ) =>
    new Date(a.createdAt).getTime() < new Date(b.createdAt).getTime() ? 1 : -1;

  const setupCurrentMessage = async () => {
    const currentMessage = await getCurrentMessage();
    setCurrentMessage(currentMessage);
  };

  async function setup() {
    const { data } = await client.models.Message.list();
    data.sort(sortMessages);
    setMessages(data);
    await setupCurrentMessage();
  }

  React.useEffect(() => {
    setup();
    const sub = client.models.Message.observeQuery().subscribe(({ items }) => {
      const data = [...items];
      data.sort(sortMessages);
      setMessages(data);
      setupCurrentMessage();
    });

    return () => sub.unsubscribe();
  }, []);

  const ref =
    React.useRef<HTMLInputElement>() as React.MutableRefObject<HTMLInputElement>;
  const buttonRef =
    React.useRef<HTMLInputElement>() as React.MutableRefObject<HTMLButtonElement>;

  if (data?.message) {
    ref.current.value = data.message;
  }

  const createMessage = async () => {
    const { errors, data: newMessage } = await client.models.Message.create({
      content: ref.current.value,
    });
    console.log(errors, newMessage);
    ref.current.value = "";
    fetch("/api/notify", {
      method: "POST",
      body: JSON.stringify({
        message: newMessage!.content,
      }),
    });
  };

  const onInputChange = (e: React.BaseSyntheticEvent) => {
    const shouldDisableButton = !e.target.value.length;
    setButtonDisabled(shouldDisableButton);
  };

  const dateToString = (date: Date) => {
    const isPm = date.getHours() > 12;
    const hours =
      date.getHours() === 0
        ? 12
        : isPm
        ? date.getHours() - 12
        : date.getHours();
    const minutes =
      date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
    return `${date.toDateString()} at ${hours}:${minutes}${isPm ? "pm" : "am"}`;
  };

  return (
    <CssVarsProvider>
      <main>
        <ModeToggle />
        <Sheet sx={sheetCss} variant="outlined">
          <div>
            <Typography level="h4" component="h1">
              <b>👋 Welcome!</b>
            </Typography>
          </div>
          <FormControl>
            <FormLabel>Add a message!</FormLabel>
            <Input
              // html input attribute
              slotProps={{ input: { ref } }}
              name="text"
              value={data?.message || undefined}
              type="text"
              placeholder="Have a great day!"
              onChange={onInputChange}
            />
          </FormControl>

          <Button
            disabled={buttonDisabled && !data?.message}
            onClick={createMessage}
            sx={{ mt: 1 /* margin top */ }}
          >
            Post Message
          </Button>
          <Button
            variant="soft"
            disabled={isLoading}
            onClick={handleClick}
            sx={{ mt: 1 /* margin top */ }}
          >
            {isLoading ? <CircularProgress /> : "Generate AI Message"}
          </Button>
          <Typography fontSize="sm" sx={{ alignSelf: "center" }}>
            Put an anonymous message on John&apos;s wall
          </Typography>
        </Sheet>
        <Sheet sx={sheetCss} variant="plain">
          <div>
            <Typography level="h4" component="h1">
              <b>Current message:</b>
            </Typography>
          </div>
          <div key={inset || "default"}>
            <ListItem>
              <ListItemDecorator>
                <Avatar size="sm" src="/static/images/avatar/1.jpg" />
                &nbsp;
              </ListItemDecorator>
              <ListItemContent>
                {currentMessage ? currentMessage.content : ""}
              </ListItemContent>
              <Typography level="body-xs">
                &nbsp;
                {dateToString(
                  new Date(currentMessage ? currentMessage.createdAt : "")
                )}
              </Typography>
            </ListItem>
          </div>
        </Sheet>
        <Sheet sx={sheetCss} variant="outlined">
          <Typography level="h4" component="h1">
            <b>This is what it looks like on my wall at home:</b>
          </Typography>
          <AspectRatio variant="outlined" ratio="1" objectFit="cover">
            <Image
              alt="Wallboard Image"
              src={wallboardImage}
              layout="fill"
              placeholder="blur"
            />
          </AspectRatio>
          <span>
            <Typography startDecorator={"> "} mb={2}>
              {'"John, how did you make this?"'}
            </Typography>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <Chip>
              <QuestionAnswer />
              &nbsp;Check it out on{" "}
              <Link href="https://github.com/johnpc/pixoo-wall">GitHub.</Link>
            </Chip>
          </span>
          <ListDivider inset={inset} />

          <div>
            <Typography level="h4" component="h1">
              <b>Previous messages:</b>
            </Typography>
          </div>
          <div key={inset || "default"}>
            <List
              variant="outlined"
              sx={{
                minWidth: 240,
                borderRadius: "sm",
              }}
            >
              {messages.map((message) => (
                <>
                  <ListItem>
                    <ListItemDecorator>
                      <Avatar size="sm" src="/static/images/avatar/1.jpg" />
                    </ListItemDecorator>
                    <ListItemContent>{message.content}</ListItemContent>
                    <Typography level="body-xs">
                      &nbsp;{dateToString(new Date(message.createdAt))}
                    </Typography>
                  </ListItem>
                  <ListDivider inset={inset} />
                </>
              ))}
            </List>
          </div>
        </Sheet>
      </main>
    </CssVarsProvider>
  );
}
