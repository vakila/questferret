import { CaretRightIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import type { Doc } from "convex/_generated/dataModel";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger } from "./ui/select";

export function QuesterOrSeeker() {
  const [role, setRole] = useState<"quester" | "seeker" | null>(null);
  return (
    <div className="flex flex-col h-full items-center justify-center">
      {role === null ? (
        <>
          <h2 className="text-2xl mb-4">
            What bringeth thee to QuestFerret this fine day?
          </h2>

          <Button
            variant="quest"
            className="w-full my-4 p-8 text-3xl"
            onClick={() => setRole("seeker")}
          >
            I seek a brave hero to aid me with my quest
          </Button>

          <Button
            variant="quest"
            className="w-full my-4 p-8 text-3xl"
            onClick={() => setRole("quester")}
          >
            I wish to fulfill a quest, earn gold and glory
          </Button>
        </>
      ) : role === "quester" ? (
        <Quester />
      ) : (
        <Seeker />
      )}
    </div>
  );
}

function Quester() {
  return "You are a quester";
}

function Seeker() {
  return "You are a seeker";
}

export function QuestTypeCard({ q, onClick }: { q: Doc; onClick: () => void }) {
  return (
    <Card key={q._id} className="grid grid-rows-2">
      <CardHeader>
        <Button
          variant="link"
          className="h-auto whitespace-normal"
          onClick={onClick}
        >
          <CardTitle className="font-display flex items-center text-4xl text-primary-foreground">
            {q.title}
            <CaretRightIcon width="30" height="30" />
          </CardTitle>
        </Button>
      </CardHeader>
      <CardContent>{q.description}</CardContent>
    </Card>
  );
}

export function QuestSearch() {
  const questTypes = useQuery(api.quests.listTypes);
  const [type, setType] = useState<string | null>(null);

  if (type) {
    return <NewQuest type={type} />;
  }
  return (
    <>
      <h2 className="font-display text-5xl text-center">
        Find a brave hero to fulfill your quest
      </h2>
      <div className="flex flex-row items-center w-full">
        <Input
          type="text"
          className="text-3xl h-12"
          placeholder="What is your quest?"
        />
        <Button
          className="text-3xl h-12 font-display bg-primary-foreground hover:bg-primary/50"
          variant="outline"
        >
          <MagnifyingGlassIcon width="30" height="30" />
        </Button>
      </div>
      <div className="w-full grid grid-cols-4 grid-flow-row gap-2">
        {questTypes?.map((q) => (
          <QuestTypeCard q={q} onClick={() => setType(q.title)} />
        ))}
      </div>
    </>
  );
}

export function NewQuest({ type }: { type: string }) {
  const [name, setName] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  return (
    <div className="flex flex-col gap-6">
      <p className="text-2xl text-center">
        Tell us of your quest, that we may seek out the best Quester for you
      </p>
      <h3 className="font-display text-primary-foreground text-5xl h-12 flex flex-row items-center gap-4">
        {type}
        {/* <Select value={type}>
          <SelectTrigger className="text-3xl h-12">{type}</SelectTrigger>
          <SelectContent className="text-3xl h-12">
            <SelectItem value={type}>{type}</SelectItem>
          </SelectContent>
        </Select> */}
      </h3>
      <Input
        type="text"
        name="seeker-name"
        placeholder="What is your name?"
        className="text-3xl h-12"
        onChange={(e) => setName(e.target.value)}
      />
      <Input
        type="text"
        name="quest-title"
        placeholder="What is your quest?"
        className="text-3xl h-12"
        onChange={(e) => setTitle(e.target.value)}
      />
      <Textarea
        name="quest-details"
        className="text-3xl"
        placeholder="Share the details of your quest"
        onChange={(e) => setDescription(e.target.value)}
      ></Textarea>
      <Button
        variant="quest"
        className="text-3xl h-12"
        disabled={!name || !title || !description}
      >
        Reveal valiant Questers
      </Button>
    </div>
  );
}
