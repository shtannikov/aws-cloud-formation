using Amazon.Util;
using Microsoft.AspNetCore.Mvc;

namespace SimpleWebApi;

public record AwsEnvironment(string Region, string AvailabilityZone);

[Route("aws-env")]
public class AwsEnvironmentController : ControllerBase
{
    [HttpGet("")]
    public AwsEnvironment Get()
        => new (
            EC2InstanceMetadata.Region?.DisplayName ?? "Unknown",
            EC2InstanceMetadata.AvailabilityZone ?? "Unknown");
}