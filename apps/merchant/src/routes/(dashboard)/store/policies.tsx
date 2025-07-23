import SliderTooltip from "@lipy/web-ui/components/custom-ui/stepSlider";
import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { StoreNav } from "./-nav";

export const Route = createFileRoute("/(dashboard)/store/policies")({
  component: RouteComponent,
});

function RouteComponent() {
  const [temperatureValue, setTemperatureValue] = useState([0]);
  const [maxTokensValue, setMaxTokensValue] = useState([0]);

  return (
    <>
      <DashboardHeader title="Store Policies" />
      <StoreNav>
        <br />

        <SliderTooltip
          id="TE"
          max={1}
          step={0.1}
          hasMarks={true}
          showTooltip={true}
          labelFor="TE"
          labelTitle="TEST"
          labelValue={temperatureValue[0]}
          onValueCommit={setTemperatureValue}
        />
        <br />
        <br />

        <SliderTooltip
          id="SliderMaxTokens"
          max={4096}
          step={4}
          showTooltip={true}
          labelFor="SliderMaxTokens"
          labelTitle="Max tokens"
          labelValue={maxTokensValue[0]}
          onValueCommit={setMaxTokensValue}
        />
        <br />
      </StoreNav>
    </>
  );
}
