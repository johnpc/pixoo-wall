import * as React from "react";
import { CssVarsProvider, useColorScheme } from "@mui/joy/styles";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemContent from "@mui/joy/ListItemContent";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import ListDivider from "@mui/joy/ListDivider";
import Avatar from "@mui/joy/Avatar";
import { Schema } from "@/amplify/data/resource";
import { generateClient } from "aws-amplify/api";
import { Amplify } from "aws-amplify";
import config from "../amplifyconfiguration.json";
import { getCurrentMessage } from "@/helpers/get-current-message";
Amplify.configure(config);
const client = generateClient<Schema>();

const sheetCss = {
  width: 300,
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
  const [currentMessage, setCurrentMessage] =
    React.useState<Schema["Message"]>();
  const [messages, setMessages] = React.useState<Schema["Message"][]>([]);
  async function setup() {
    const { data } = await client.models.Message.list();
    data
      .sort((a, b) =>
        new Date(a.createdAt).getTime() > new Date(b.createdAt).getTime() ? 1 : -1
      );
    setMessages(data);
    const currentMessage = await getCurrentMessage();
    setCurrentMessage(currentMessage);
  }

  React.useEffect(() => {
    setup();
    const sub = client.models.Message.observeQuery().subscribe(({ items }) => {
      const messages = [...items];
      messages.sort((a, b) =>
        new Date(a.createdAt).getTime() > new Date(b.createdAt).getTime() ? 1 : -1
      );
      setMessages(messages);
      setCurrentMessage(messages[messages.length - 1]);
    }
    );

    return () => sub.unsubscribe();
  }, []);

  const ref =
    React.useRef<HTMLInputElement>() as React.MutableRefObject<HTMLInputElement>;

  const createMessage = async () => {
    const { errors, data: newMessage } = await client.models.Message.create({
      content: ref.current.value,
    });
    console.log(errors, newMessage);
    ref.current.value = '';
    fetch('/api/notify');
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
            <FormLabel>Add a message</FormLabel>
            <Input
              // html input attribute
              slotProps={{ input: { ref } }}
              name="text"
              type="text"
              placeholder="Have a great day!"
            />
          </FormControl>

          <Button onClick={createMessage} sx={{ mt: 1 /* margin top */ }}>
            Post Message
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
              </ListItemDecorator>
              <ListItemContent>
                &nbsp;{currentMessage ? currentMessage.content : ""}
              </ListItemContent>
              <Typography level="body-sm">
                {new Date(
                  currentMessage ? currentMessage.createdAt : ""
                  ).toDateString()}
              </Typography>
            </ListItem>
          </div>
        </Sheet>
        <Sheet sx={sheetCss} variant="outlined">
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
                    <Typography level="body-sm">
                      {new Date(message.createdAt).toDateString()}
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
