import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useForm } from "react-hook-form";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Slider } from "./ui/slider";
import { CaretRightIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

const ABILITIES = {
  CHA: "Charisma",
  WIS: "Wisdom",
  INT: "Intuition",
  CON: "Constitution",
  DEX: "Dexterity",
  STR: "Strength",
};

export function BrowseQuesters({ quest }: { quest: any }) {
  const { title, type, seekerName } = quest;
  const allClasses = useQuery(api.questers.listClasses);

  const form = useForm({
    defaultValues: {
      classes: [] as string[],
      abilities: {
        CHA: 0,
        WIS: 0,
        INT: 0,
        CON: 0,
        DEX: 0,
        STR: 0,
      },
    },
  });
  const [classes, setClasses] = useState(form.getValues().classes);
  const [abilityMins, setAbilityMins] = useState(form.getValues().abilities);

  const questers = useQuery(api.questers.list, { classes, abilityMins });

  return (
    <div className="grid grid-cols-sidebar gap-2">
      <div className="my-4 text-3xl">
        <Card className=" p-4">
          <CardHeader>
            <h2 className="text-3xl text-primary-foreground font-display">
              {type}
            </h2>
            <h3>
              {title} for {seekerName}
            </h3>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                className="space-y-8"
                onSubmit={(e) => {
                  e.preventDefault();
                  console.log(form.getValues());
                  setClasses(form.getValues().classes);
                  setAbilityMins(form.getValues().abilities);
                }}
              >
                <FormField
                  control={form.control}
                  name="classes"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="text-base">Class</FormLabel>
                        <FormDescription>
                          Filter Questers by Class
                        </FormDescription>
                      </div>
                      <div className="grid grid-flow-row grid-cols-2 gap-2">
                        {allClasses?.map((item) => (
                          <FormField
                            key={item._id}
                            control={form.control}
                            name="classes"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={item._id}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(item.name)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([
                                              ...field.value,
                                              item.name,
                                            ])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== item.name
                                              )
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {item.name}
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="abilities"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="text-base">Abilities</FormLabel>
                        <FormDescription>
                          Filter Questers by minimum score
                        </FormDescription>
                      </div>
                      <div className="grid grid-flow-row grid-cols-1 gap-2">
                        {Object.entries(ABILITIES).map(([abbrv, name]) => (
                          <FormField
                            key={abbrv}
                            control={form.control}
                            name="abilities"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={abbrv}
                                  className="grid grid-cols-3 items-center space-x-3 space-y-0"
                                >
                                  <FormLabel className="font-normal">
                                    {name}
                                  </FormLabel>
                                  <span className="text-sm flex ">
                                    <CaretRightIcon width="20" height="20" />
                                    {
                                      field.value[
                                        abbrv as keyof typeof ABILITIES
                                      ]
                                    }
                                  </span>

                                  <FormControl>
                                    <Slider
                                      defaultValue={[0]}
                                      min={0}
                                      max={20}
                                      step={1}
                                      onValueChange={(value) =>
                                        field.onChange({
                                          ...field.value,
                                          [abbrv]: value[0],
                                        })
                                      }
                                    />
                                  </FormControl>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" variant="quest">
                  Apply filters
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      <div className="my-4 flex flex-col gap-2">
        {questers?.map((q) => (
          <Card className="p-6" key={q._id}>
            <CardHeader className="flex flex-row gap-4 justify-between items-center">
              <h3 className="font-display text-4xl text-primary-foreground">
                {q.name}
              </h3>
              <div className="flex gap-4 text-2xl">
                <Badge variant="outline">{q.class}</Badge>
                <Badge
                  variant={
                    q.alignment.endsWith("Evil")
                      ? "destructive"
                      : q.alignment.endsWith("Good")
                      ? "default"
                      : "secondary"
                  }
                >
                  {q.alignment}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p>{q.about}</p>

              <div className="mt-6 w-full grid grid-cols-2 gap-8">
                {Object.entries(ABILITIES).map(([abbrv, name]) => (
                  <p className="grid grid-cols-2 justify-left items-center gap-2">
                    <div className="flex flex-row items-center justify-between gap-2">
                      <span className="font-display text-1xl">{name}</span>
                      {q[abbrv]}
                    </div>
                    <Progress value={100 * (q[abbrv] / 20)} title={q[abbrv]} />
                  </p>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Dialog>
                <DialogTrigger>
                  <Button variant="quest" className="p-6">
                    Send missive to {q.name.split(" ")[0]}{" "}
                    <ChevronRightIcon width="20" height="20" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <h3 className="font-display text-3xl">Success!</h3>
                  <p>
                    A carrier pigeon has been dispatched to {q.name} informing
                    them of your quest request.
                  </p>
                  <p>
                    They will either respond by fulfilling the quest, or simply
                    ignore your missive and leave you to languish in futile
                    hope.
                  </p>
                  <p className="font-display text-1xl">
                    Thank you for using QuestFerret!
                  </p>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
