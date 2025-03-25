import { useEffect, useState, useMemo } from "react";
import { Popover, Portal, Wrap, Input, Stack } from "@chakra-ui/react";
import { useUnit } from "effector-react";
import { $offices } from "../effector/offices.store";
import {
  $regions,
  $selectedRegion,
  loadRegionsEv,
  setRegionEv,
} from "../effector/regions.store";
import { LuSearch } from "react-icons/lu";
import { InputGroup } from "./ui/input-group";
import { TRegion } from "../types";
import { RadioBadges } from "./radio-badges";

type OfficesPopoverProps = {
  readonly children: React.ReactElement;
};

export function OfficesPopover({ children }: OfficesPopoverProps) {
  const [searchString, setSearchString] = useState<string>("");
  const [offices, regions, selectedRegion, setRegion] = useUnit([
    $offices,
    $regions,
    $selectedRegion,
    setRegionEv,
  ]);

  const handleRegionChange = (region: TRegion) => {
    setRegion(region);
  };

  const filteredRegions = useMemo(
    () =>
      regions.filter((region) =>
        region.title.toLowerCase().includes(searchString.toLowerCase())
      ),
    [regions, searchString]
  );

  useEffect(() => {
    loadRegionsEv();
  }, []);

  return (
    <Popover.Root>
      <Popover.Trigger>{children}</Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          <Popover.Content>
            <Popover.Arrow />
            <Popover.Body>
              <Stack gap="10px" direction="column">
                <InputGroup flex="1" startElement={<LuSearch />} width="100%">
                  <Input
                    placeholder="Поиск филиалов"
                    value={searchString}
                    onChange={({ target }) => setSearchString(target?.value!)}
                  />
                </InputGroup>
                <RadioBadges
                  elements={filteredRegions as TRegion[]}
                  itemRenderer={(item: TRegion) => item.title}
                  value={selectedRegion!}
                  onSelect={handleRegionChange}
                />
              </Stack>
            </Popover.Body>
            <Popover.CloseTrigger />
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
}
